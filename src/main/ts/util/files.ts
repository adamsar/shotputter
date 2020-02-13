import {base64ToBlob} from "base64-blob";

function blobToBuffer(blob: Blob): Promise<Buffer> {
    if (typeof Blob === 'undefined' || !(blob instanceof Blob)) {
        throw new Error('first argument must be a Blob')
    }


    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        function onLoadEnd (e: any) {
            reader.removeEventListener('loadend', onLoadEnd, false);
            if (e.error) reject(e.error);
            // @ts-ignore
            else resolve(Buffer.from(reader.result));
        }

        reader.addEventListener('loadend', onLoadEnd, false);
        reader.readAsArrayBuffer(blob);
    });
};

export const base64ToBuffer = async (base64String: string): Promise<Buffer> => {
    return blobToBuffer(await base64ToBlob(base64String));
};