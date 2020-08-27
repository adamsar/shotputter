import * as path from "path";
import {ImageUploader, ImageUploadError} from "@shotputter/common/src/main/ts/services/images/uploader";
import {chain, map, mapLeft, TaskEither, tryCatch} from "fp-ts/TaskEither";
import {v1 as uuid} from "uuid";
import {taskEitherExtensions} from "@shotputter/common/src/main/ts/util/fp-util";
import * as fs from "fs/promises";
import {pipe} from "fp-ts/lib/pipeable";
import {left, right} from "fp-ts/lib/Either";

export type ImageGet$Error = "not-found" | { error: any };

export type ImageArchiver = ImageUploader & {
    getImage: (imageName: string) => TaskEither<ImageGet$Error, Buffer>;
    testWrite: () => TaskEither<{ error: any }, true>;
}

export const LocalImageArchiver = (localDir: string, host: string) => {
    const uploadDir = localDir.charAt(0) === "/" ? localDir : path.join(__dirname, localDir);
    return {
        uploadImage: (image: string): TaskEither<ImageUploadError, string> => {
            const name = `${uuid()}.png`
            const _path = path.join(uploadDir, name);
            const base64Image = image.split(';base64,').pop();
            const writeTask = () => fs.writeFile(_path, base64Image, {encoding: "base64"});
            return pipe(
                taskEitherExtensions.fromPromise(writeTask()),
                mapLeft((error) => ({type: "imageUpload", error}) as ImageUploadError),
                map(_ => `${host}/images/${name}`)
            );
        },
        getImage: (imageName: string ): TaskEither<ImageGet$Error, Buffer> => {
            const _path = path.join(uploadDir, imageName);
            return async () => {
                try {
                    const result = await fs.readFile(_path)
                    return right(result)
    ***REMOVED*** catch (error) {
                    if (error?.code === "ENOENT") {
                        return left("not-found");
        ***REMOVED*** else {
                        return left(error.toString());
        ***REMOVED***
    ***REMOVED***

***REMOVED***

        },
        testWrite: (): TaskEither<{ error: any }, true> => {
            const directoryExists = async () => {
                try {
                    return right(await fs.readdir(uploadDir));
    ***REMOVED*** catch (error) {
                    if (error?.code === "ENOENT") {
                        return right(undefined)
        ***REMOVED*** else {
                        return left({error})
        ***REMOVED***
    ***REMOVED***
***REMOVED***

            const createIfNecessary = (input: string[] | undefined): TaskEither<{error: any}, any>=> {
                if (input === undefined) {
                    return tryCatch(
                        () => fs.mkdir(uploadDir),
                        (error:any) => ({error})
                        )
    ***REMOVED*** else {
                    return taskEitherExtensions.right(({}))
    ***REMOVED***
***REMOVED***

            const writeCheck = (_: any): TaskEither<{error: any}, any> => {
                const testFile = path.join(uploadDir, "testFile.txt");
                return pipe(
                    tryCatch(() => fs.writeFile(testFile, "test"),
                        (error:any) => ({error})
                    ),
                    chain(_ => tryCatch(
                        () => fs.unlink(testFile),
                        (error:any) => ({error})
                        )
                    ));
***REMOVED***

            return pipe(
                directoryExists,
                chain(createIfNecessary),
                chain(writeCheck),
                map(_ => true)
            )
        }
    };
}
