/* eslint-disable @typescript-eslint/no-explicit-any */
import { VeltPresence, VeltProvider } from '@veltdev/react'
import './App.css'
import BlockNoteEditor from './components/BlockNoteEditor'
import VeltCollaboration from './velt-components/VeltCollaboration'

// Prod: Emcfab4ysRXaC1CZ8hmG
// Develop: krUVK3LgYeifgViaY3Oa

function App() {

  return (
    <>
      <VeltProvider apiKey={'Emcfab4ysRXaC1CZ8hmG'} config={{
        // version: '4.5.0-beta.181',
        // develop: true,
        // integrity: true,
      } as any}
      // encryptionProvider={{
      //   encrypt: async (config) => {
      //     console.log('encrypt', config.data);
      //     if (Array.isArray(config.data)) {
      //       const stringFromArray = config.data.map((item) => item.toString()).join('__');
      //       console.log('stringFromArray', stringFromArray);
      //       return stringFromArray; // Returns Promise<string> implicitly via async
      //     }
      //     // Handle non-array case or throw error as needed
      //     throw new Error('Input must be an array');
      //   },
      //   decrypt: async (config) => {
      //     console.log('decrypt', config.data);
      //     if (typeof config.data === 'string') {
      //       const arrayFromString = config.data.split('__').map((item) => parseInt(item));
      //       console.log('arrayFromString', arrayFromString);
      //       return arrayFromString; // Returns Promise<number[]> implicitly via async
      //     }
      //     // Handle non-string case or throw error as needed
      //     throw new Error('Input must be a string');
      //   }
      // } as VeltEncryptionProvider<number[], string>}
      >
        <div className="app-container">
          <header className="app-header">
            <h1 className="app-title">Velt Collaborative BlockNote Editor</h1>
            <div className="login-section">
              <VeltPresence />
              <VeltCollaboration />
            </div>
          </header>
          <main className="app-content">
            <BlockNoteEditor />
          </main>
        </div>
      </VeltProvider>
    </>
  )
}

export default App
