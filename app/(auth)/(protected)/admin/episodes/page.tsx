import React from "react";
import VideoUpload from "@/components/file/video-upload";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";

const EpisodesPage = () => {
    return (
        <div className="w-full flex flex-col space-x-3 p-4">
            <div className="flex items-center mb-4 space-x-5 p-4">
                <h1>Сторінка епізодів</h1>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus /> Додати серію
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[1225px] sm:max-h-[95%] overflow-y-scroll">
                        <DialogHeader>
                            <DialogTitle>Додавання серії</DialogTitle>
                            <DialogDescription>
                                Завантажте серію у найвищій якості та обкладинку.
                            </DialogDescription>
                        </DialogHeader>
                        <VideoUpload />

                        <Input/>
                    </DialogContent>
                </Dialog>

            </div>



        </div>
    );
};

export default EpisodesPage;
