export interface ImgurUploader {
    uploadImage: (file: string) => Promise<string>;
}

export const ImgurUploader = (clientId: string): ImgurUploader => {
    return {
        uploadImage: async (file: string) => {
            const result = await (await fetch("https://api.imgur.com/3/image", {
                method: "POST",
                body: JSON.stringify({
                    image: file
                }),
                headers: {
                    Authorization: `Client-ID ${clientId}`
                }
            })).json();
            return result['data']['link'];
        }
    }
};