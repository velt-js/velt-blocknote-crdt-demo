/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import '@blocknote/mantine/style.css'
import '@blocknote/core/fonts/inter.css'
import { useVeltClient, useVeltEventCallback } from "@veltdev/react";
import { VeltBlockNoteStore, createVeltBlockNoteStore } from "@veltdev/blocknote-crdt";

const BlockNoteCollaborativeEditor: React.FC = () => {
  const veltBlockNoteStoreRef = useRef<VeltBlockNoteStore | null>(null);
  const { client } = useVeltClient();
  const veltUser = useVeltEventCallback('userUpdate');

  useEffect(() => {
    if (!veltUser || !client) return;

    initializeStore();

    return () => {
      if (veltBlockNoteStoreRef.current) {
        veltBlockNoteStoreRef.current.destroy();
      }
    };
  }, [client, veltUser]);

  const initializeStore = async () => {
    const veltBlockNoteStore = await createVeltBlockNoteStore({
      editorId: 'velt-blocknote-crdt-demo-28-aug-1-default',
      veltClient: client!,
      initialContent: JSON.stringify([{ type: "paragraph", content: "" }]) // BlockNote-compatible initial block
    });
    veltBlockNoteStoreRef.current = veltBlockNoteStore;
    setVeltBlockNoteStoreReady(true);
  }

  const [veltBlockNoteStoreReady, setVeltBlockNoteStoreReady] = useState(false);

  // Compute collaboration config (stable object; memoize if needed for perf)
  const collaborationConfig = useMemo(() => {
    if (!veltBlockNoteStoreReady || !veltBlockNoteStoreRef.current || !veltUser) return undefined;

    const store = veltBlockNoteStoreRef.current;
    store.getStore().getProvider().connect(); // Ensure connected

    return {
      fragment: store.getYXml()!,
      provider: store.getStore().getProvider(),
      user: {
        name: veltUser.name || 'Anonymous',
        color: veltUser.color || '#000000'
      },
    };
  }, [veltBlockNoteStoreReady, veltUser]);

  // Now call the hook at top level with the config
  const editor = useCreateBlockNote({
    collaboration: collaborationConfig,
    // Add any other static options here
  }, [collaborationConfig]); // Deps ensure re-init if config changes

  return (
    <>
      <div className="editor-container">
        <div className="editor-header">
          Collaborative Editor - {veltUser?.name ? `Editing as ${veltUser.name}` : 'Please login to start editing'}
        </div>
        <div className="editor-content">
          <BlockNoteView editor={editor} key={collaborationConfig ? 'collab-on' : 'collab-off'} />
        </div>
        <div className="status">
          {veltBlockNoteStoreReady ? 'Connected to collaborative session' : 'Connecting to collaborative session...'}
        </div>
      </div>
    </>
  );
};

export default BlockNoteCollaborativeEditor;