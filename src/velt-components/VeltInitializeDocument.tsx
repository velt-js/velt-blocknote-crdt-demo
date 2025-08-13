import { useSetDocuments } from '@veltdev/react';
import { useEffect } from 'react';

function VeltInitializeDocument() {

    const { setDocuments } = useSetDocuments();

    useEffect(() => {
        setDocuments([
            {
                id: 'velt-blocknote-crdt-demo-document2-13-aug-2025',
                metadata: {
                    documentName: 'Velt BlockNote CRDT Demo Document2 13 Aug 2025',
                }
            }
        ])
    }, []);

    return (
        <></>
    )
}

export default VeltInitializeDocument;