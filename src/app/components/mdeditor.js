import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    {
        ssr: false,
    }
);

function MdEditor({ content, onChange }) {
    return (
        <div>
            <MDEditor value={content} onChange={onChange} height={600} />
        </div>
    );
}

export default MdEditor;