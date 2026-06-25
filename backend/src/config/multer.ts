import multer from "multer";

import path from "path";

const storage = multer.diskStorage({

    destination: (

        req,
        file,
        cb

    ) => {

        cb(

            null,

            "uploads/avatars"

        );

    },

    filename: (

        req,
        file,
        cb

    ) => {

        const extension =

            path.extname(

                file.originalname

            );

        cb(

            null,

            `avatar-${
                Date.now()
            }${extension}`

        );

    }

});

const fileFilter: multer.Options["fileFilter"] = (

    req,
    file,
    cb

) => {

    const allowed = [

        "image/png",

        "image/jpeg",

        "image/jpg",

        "image/webp"

    ];

    if (

        allowed.includes(

            file.mimetype

        )

    ) {

        cb(null, true);

        return;

    }

    cb(

        new Error(

            "Formato no permitido"

        )

    );

};

export const uploadAvatar = multer({

    storage,

    fileFilter,

    limits: {

        fileSize:

            5 * 1024 * 1024

    }

});