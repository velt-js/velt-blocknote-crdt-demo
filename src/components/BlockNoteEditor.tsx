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
      editorId: 'velt-blocknote-crdt-demo-11-aug-2-default',
      veltClient: client!,
      initialContent: JSON.stringify([{ type: "paragraph", content: "" }]) // BlockNote-compatible initial block
    });
    veltBlockNoteStoreRef.current = veltBlockNoteStore;
    setVeltBlockNoteStoreReady(true);
  }

  const [veltBlockNoteStoreReady, setVeltBlockNoteStoreReady] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [versions, setVersions] = useState<any[]>([]);

  useEffect(() => {
    console.log('versions', versions);
  }, [versions]);

  const handleVersionNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVersionName(e.target.value);
  }

  const handleSaveVersion = () => {
    if (veltBlockNoteStoreRef.current) {
      console.log('Saving version', versionName);
      veltBlockNoteStoreRef.current.getStore().saveVersion(versionName);
    }
  }

  const fetchVersions = async () => {
    if (veltBlockNoteStoreRef.current) {
      const fetchedVersions = await veltBlockNoteStoreRef.current.getStore().getVersions();
      setVersions(fetchedVersions);
    }
  }

  const handleVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const versionId = e.target.value;
    if (veltBlockNoteStoreRef.current) {
      const version = versions.find((v) => v.versionId === versionId);
      if (version) {
        console.log('Restoring version', versionId);
        veltBlockNoteStoreRef.current.getStore().setStateFromVersion(version);
      }
    }
  }

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
      {/* <div className="version-name-input">
        <input type="text" placeholder="Enter version name" value={versionName} onChange={handleVersionNameChange} />
        <button onClick={handleSaveVersion}>Save</button>
        <button onClick={fetchVersions}>Fetch Versions</button>
        <select onChange={handleVersionChange}>
          {versions.map((version) => (
            <option key={version.versionId} value={version.versionId}>{version.versionName}</option>
          ))}
        </select>
      </div> */}
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