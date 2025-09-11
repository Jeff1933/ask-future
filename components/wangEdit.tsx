"use client"

import '@wangeditor/editor/dist/css/style.css' // 引入 css

import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, memo } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { saveMail, singleMail } from "@/lib/idb";
import { useForNow } from "@/hooks/use-user";
import { useWriteChangeFlag } from "@/hooks/use-auto-save";
import { useMode } from '@/hooks/use-mail'
interface EditorProps {
  content: {
    text: string,
    img: Blob[] | null,
  },
  eHeight?: string,
}

type InsertFnType = (url: string, alt: string, href: string) => void;

const MyEditor = forwardRef(({ content, eHeight }: EditorProps, ref) => {
  const [isNow] = useForNow();
  const setFlag = useWriteChangeFlag();
  const [createMode] = useMode();
  const editorRef = useRef<IDomEditor | null>(null);
  // editor 实例
  // const [editor, setEditor] = useState<IDomEditor | null>(null) // TS 语法

  const renderHtml = (content: EditorProps["content"]) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content.text, "text/html")

    const imgElements = doc.querySelectorAll("img");

    if (content.img && content.img.length > 0) {
      imgElements.forEach((img, index) => {
        if (content.img && content.img[index]) {
          const blobUrl = URL.createObjectURL(content.img[index]);
          img.src = blobUrl;
        }
      })
    }

    return doc.body.innerHTML;
  }

  // 编辑器内容
  const [html, setHtml] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setHtml(renderHtml(content))
    }, 0);
    // setHtml(renderHtml(content))
  }, [content]);

  // useEffect(() => {
  //   if (isNow) {
  //     // const isFocus = editorRef.current?.isFocused();
  //     if (focusFlag.current === 0) {
  //       console.log("focus");
  //       editorRef.current?.focus();
  //       focusFlag.current = 1;
  //     } else {
  //       console.log("blur")
  //       editorRef.current?.blur();
  //       focusFlag.current = 0;
  //     }
  //   }
  // }, [isNow, content])

  useEffect(() => {
    // console.log("编辑转换")
    if (editorRef.current) {
      if (!isNow) {
        editorRef.current.disable();
      } else {
        editorRef.current.enable();
      }
    }    
  }, [isNow])

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {
    excludeKeys: [
      'bgColor',
      'code',
      'codeBlock',
      'codeSelectLang',
      'divider',
      'insertLink',
      'showLinkImg',
      'group-image',
      'group-video',
      'editLink',
      'insertTable',
      'insertTableCol',
      'insertTableRow',
      'tableFullWidth',
      'tableHeader',
      'todo',      
      'unLink',
      'viewLink',
      'group-more-style', // 排除菜单组，写菜单组 key 的值即可
      'viewImageLink',
    ],
    insertKeys: {
      index: 20,
      keys: ['uploadImage'],
    }
  }

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    // TS 语法
    scroll: true,
    placeholder: '请输入内容...',
    readOnly: !isNow,
    MENU_CONF: {
      uploadImage: {
        async customUpload(file: File, insertFn: InsertFnType) {
          console.log('Upload File: ', file);
          const url = URL.createObjectURL(file);
          const alt = file.name;
          const href = url;

          insertFn(url, alt, href);
          console.log(`Insert img with local url: ${url}`)
        },
        fieldName: 'file', // 上传时传递的文件表单名，默认 'wangeditor-uploaded-image'
        maxFileSize: 1 * 1024 * 1024, // 1M
        maxNumberOfFiles: 5,
        allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'], // 允许的文件类型
      },      
    },
    onChange: () => {
      if (isNow && createMode) {
        setFlag((prev) => prev + 1);
      }
    }
  }
  // const ToolbarConfig = editorRef.current?.getAllMenuKeys();

  const handleSave = async (mail: singleMail, isSend = false) => {
    if (!editorRef.current) return;

    const editorHtml = editorRef.current.getHtml();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = editorHtml;

    const plain = tempDiv.textContent || "";

    const imgElements = Array.from(tempDiv.querySelectorAll("img"));
    const blobArr: Blob[] = [];
    for (const imgElement of imgElements) {
      if (imgElement.src) {
        const res = await fetch(imgElement.src);
        const blob = await res.blob();
        blobArr.push(blob);
      }
    }
    
    mail.plain = plain;
    mail.text = editorHtml;
    mail.img = blobArr;
    if (isSend) {
      // plain空值检测，提示什么都没写。
      mail.send = true;
    }
    await saveMail(mail);
  }

  const autoFocusFn = () => {
    console.log("focusing")
    editorRef.current?.focus(true);
  }

  useImperativeHandle(ref, () => ({
    save: handleSave,
    autoFocus: autoFocusFn,
  }))

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      // if (editor == null) return
      // editor.destroy()
      // setEditor(null)
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    }
  }, [])

  // console.log("I want to know what html is:", html)
  // if (isNow) {
  //   editorRef.current?.focus();
  // }
  return (
    <>
      <div style={{ border: 'none', zIndex: 100 }}>
        <Toolbar
          editor={editorRef.current}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={(editor) => {
            if (!editorRef.current) {
              editorRef.current = editor; // 只保存一次实例
            }            
          }}
          // onChange={(editor) => {    
          //   const newHtml = editor.getHtml();
          //   setHtml((prevHtml) => {
          //     return newHtml
          //   });
          // }}
          mode="default"
          style={{ height: eHeight || '35vh', overflowY: 'hidden', maxHeight: '636px' }}
        />
      </div>
      {/* <div style={{ marginTop: '15px' }}>{html}</div> */}
    </>
  )
})

MyEditor.displayName = 'MyEditor';

export default MyEditor