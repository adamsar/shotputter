import {ImageArchiver} from "./LocalImageArchiver";
import * as express from "express";
import {_route} from "../routing/route";
import {pipe} from "fp-ts/pipeable";
import {chain, fromOption, map, mapLeft} from "fp-ts/lib/TaskEither";
import {NotFound, OkFile, ServerError} from "../routing/responses";
import {fromNullable} from "fp-ts/Option";

export const imagesRouter = (imageArchiver: ImageArchiver) : express.Router => {
    const router = express.Router();

    router.get("/:image", _route(({req}) => {
        const getImage = fromOption(
            () => NotFound
        )(fromNullable(req.params['image']));

        return pipe(
            getImage,
             chain(imageName => pipe(
                 imageArchiver.getImage(imageName),
                 mapLeft(error => error === "not-found" ? NotFound : ServerError(error))
                )
             ),
             map(file => OkFile(file))
        );
    }));
    return router
}
