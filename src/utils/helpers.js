export const conversionTable = {
    "text/plain": ["txt"],
    "text/plain; charset=utf-8": ["txt"],
    "text/markdown": ["md", "html", "txt"],
    "text/html": ["html", "md", "txt"],
    "application/json": ["json", "txt"],
    "image/png": ["png", "jpeg", "webp", "gif", "jpg"],
    "image/jpeg": ["jpeg", "png", "webp", "gif"],
    "image/webp": ["webp", "png", "jpeg", "gif", "jpg"],
    "image/gif": ["gif", "png", "jpeg", "webp", "jpg"],
    "image/jpg": ["jpg", "png", "webp", "gif"],
};

export const showConvertedData = (convertedData) => {
    if (!convertedData) {
        return ""
    }

    // String. i.e. text/plain - "Hello World"
    if (typeof convertedData === "string") {
        return convertedData
    }
    // Blob. i.e. image/png - Blob
    if (convertedData instanceof Blob) {
        return <img src={URL.createObjectURL(convertedData)} alt={"Fragment"}/>
    }
    // Object. i.e. application/json - { "hello": "world" }
    else if (typeof convertedData === "object") {
        return JSON.stringify(convertedData, null, 2)
    }
}

/** image onto base64 */
export function convertToBase64(file){
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        // fileReader.onload = () => {
        //     resolve(fileReader.result)
        // }

        fileReader.onloadend = () => {
            resolve(fileReader.result.split(',')[1])
        }

        fileReader.onerror = (error) => {
            reject(error)
        }
    })
}