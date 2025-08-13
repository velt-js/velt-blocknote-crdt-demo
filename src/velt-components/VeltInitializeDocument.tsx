import { useSetDocuments } from '@veltdev/react';
import { useEffect } from 'react';

function VeltInitializeDocument() {

    const { setDocuments } = useSetDocuments();

    useEffect(() => {
        setDocuments([
            {
                id: 'velt-blocknote-crdt-demo-document1-13-aug-2025',
                metadata: {
                    documentName: 'Velt BlockNote CRDT Demo Document1 13 Aug 2025',
                }
            }
        ])
    }, []);

    return (
        <></>
    )
}

export default VeltInitializeDocument;