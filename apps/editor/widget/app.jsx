/**
 * TODO:
 *
 * The ability to toggle editors is more specific to the type itself -- there should be an "edit" view with the ability to select available editors
 *
 */

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Header = styled.div`
  background-color: #333;
  padding: 20px;
  display: flex;
  justify-content: space-between;
`;

const EditorWrapper = styled.div`
  flex: 1;
  padding: 96px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
`;

const EditorTextarea = styled.textarea`
  width: 100%;
  height: 100%;
  border: none;
  font-size: 16px;
  resize: none;
  outline: none;
`;

const PreviewContent = styled.div`
  color: #333;
  font-size: 16px;
`;

const Select = styled.select``;

const Option = styled.option``;

const Label = styled.label`
  margin-right: 10px;
`;

const Button = styled.button`
  // this could take in theme
  padding: 10px 20px;
`;

const ModalBox = styled.div`
  background-color: white;
  min-width: 400px;
  max-width: 600px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 1003;
`;

const draftKey = "draft";

const set = (k, v) => {
  Storage.privateSet(k, v);
};

const get = (k) => {
  return Storage.privateGet(k);
};

const draft = get(draftKey);
const defaultViewMode = get("viewMode");
const defaultPreview = get("preview");
const defaultEditor = get("editor");

if (
  draft === null ||
  viewMode === null ||
  defaultPreview === null ||
  defaultEditor === null
) {
  return "";
}

const [content, setContent] = useState(draft);
const [viewMode, setViewMode] = useState(defaultViewMode || "single"); // 'single' or 'split'
const [showPreview, setShowPreview] = useState(defaultPreview || false);
const [editor, setEditor] = useState(defaultEditor || "");

const handleToggleViewMode = () => {
  const newMode = viewMode === "single" ? "split" : "single";
  set("viewMode", newMode);
  setViewMode(newMode);
};

const handleTogglePreview = () => {
  set("preview", !showPreview);
  setShowPreview(!showPreview);
};

const editors = [
  {
    value: "",
    label: "default textarea",
  },
  {
    value: "devs.near/widget/markdown.SimpleMDE",
    label: "SimpleMDE",
  },
  {
    value: "devs.near/widget/markdown.MarkdownEditorIframe",
    label: "MarkdownEditorIframe",
  },
];

const DefaultEditor = ({ value, onChange }) => (
  <EditorTextarea
    placeholder="Start typing..."
    value={value}
    onChange={onChange}
  />
);

return (
  <PageContainer>
    <Header>
      <div>
        {viewMode === "single" && (
          <Button onClick={handleTogglePreview}>
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
        )}
        <Button onClick={handleToggleViewMode}>Toggle View Mode</Button>
      </div>
      <div>
        <Widget
          src="nui.sking.near/widget/Layout.Modal"
          props={{
            open: state.saveModalOpen,
            onOpenChange: (open) => {
              State.update({
                ...state,
                saveModalOpen: open,
              });
            },
            toggle: (
              <Button
                className="classic"
                onClick={() => toggleModal()}
                disabled={!content}
              >
                <>
                  <i className={"bi bi-save"} />
                  save
                </>
              </Button>
            ),
            content: (
              <div className="w-100">
                <ModalBox>
                  <Widget
                    src={"devs.near/widget/modal.create"}
                    props={{
                      creatorId: context.accountId,
                      path: path,
                      data: content,
                    }}
                  />
                </ModalBox>
              </div>
            ),
          }}
        />
        <Widget
          src="nui.sking.near/widget/Layout.Modal"
          props={{
            open: state.shareModalOpen,
            onOpenChange: (open) => {
              State.update({
                ...state,
                shareModalOpen: open,
              });
            },
            toggle: (
              <Button
                className="classic"
                onClick={() => toggleModal()}
                disabled={!content}
              >
                <>
                  <i className={"bi bi-send"} />
                  post
                </>
              </Button>
            ),
            content: (
              <div className="w-100">
                <ModalBox>
                  <Widget
                    src={"devs.near/widget/modal.post"}
                    props={{
                      creatorId: context.accountId,
                      path: path,
                    }}
                  />
                </ModalBox>
              </div>
            ),
          }}
        />
      </div>
    </Header>
    <div>
      <Label>editor:</Label>
      <Select
        onChange={(e) => {
          set("editor", e.target.value);
          setEditor(e.target.value);
        }}
      >
        {editors &&
          editors.map((it) => (
            <Option value={it.value} selected={it.value === editor}>
              {it.label}
            </Option>
          ))}
      </Select>
    </div>
    {viewMode === "single" ? (
      <EditorWrapper>
        {showPreview ? (
          <PreviewContent>{content}</PreviewContent>
        ) : (
          <>
            {editor ? (
              <Widget
                src={editor}
                props={{
                  value: { content },
                  onChange: (v) => {
                    setContent(v);
                    set(draftKey, v);
                  },
                }}
              />
            ) : (
              <DefaultEditor
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  Storage.privateSet(draftKey, e.target.value);
                }}
              />
            )}
          </>
        )}
      </EditorWrapper>
    ) : (
      <div style={{ display: "flex", height: "100%" }}>
        <EditorWrapper>
          <EditorTextarea
            placeholder="Start typing..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </EditorWrapper>
        <EditorWrapper>
          <PreviewContent>{content}</PreviewContent>
        </EditorWrapper>
      </div>
    )}
  </PageContainer>
);
