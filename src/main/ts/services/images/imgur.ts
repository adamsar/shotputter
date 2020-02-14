export interface ImgurUploader {
    uploadImage: (file: string) => Promise<string>;
}

export const ImgurUploader = (clientId: string): ImgurUploader => {
    return {
        uploadImage: async (file: string) => {
            const result = await (await fetch("https://api.imgur.com/3/image", {
                method: "POST",
                body: JSON.stringify({
                    image: file.replace("data:image/jpeg;base64,", "")
                }),
                headers: {
                    Authorization: `Client-ID ${clientId}`,
                    "Content-Type": "application/json"
                }
            })).json();
            if (!result['success']) {
                throw result
            }
            return result['data']['link'];
        }
    }
};