import { Modal } from "@mui/material";
import ClassInfo from "../ClassInfo";
import { sitClassRecurrentId } from "../../lib/iBooking";
import { AllConfigsIndex, ClassPopularity, ClassPopularityIndex, UserSessionsIndex } from "../../types/rezervoTypes";
import React, { Dispatch, SetStateAction } from "react";
import { SitClass } from "../../types/sitTypes";

const ClassInfoModal = ({
    classInfoClass,
    setClassInfoClass,
    classPopularityIndex,
    allConfigsIndex,
    userSessionsIndex,
}: {
    classInfoClass: SitClass | null;
    setClassInfoClass: Dispatch<SetStateAction<SitClass | null>>;
    classPopularityIndex: ClassPopularityIndex;
    allConfigsIndex: AllConfigsIndex | undefined;
    userSessionsIndex: UserSessionsIndex | undefined;
}) => {
    return (
        <Modal open={classInfoClass != null} onClose={() => setClassInfoClass(null)}>
            <>
                {classInfoClass && (
                    <ClassInfo
                        _class={classInfoClass}
                        classPopularity={
                            classPopularityIndex[sitClassRecurrentId(classInfoClass)] ?? ClassPopularity.Unknown
                        }
                        configUsers={allConfigsIndex ? allConfigsIndex[sitClassRecurrentId(classInfoClass)] ?? [] : []}
                        userSessions={userSessionsIndex ? userSessionsIndex[classInfoClass.id] ?? [] : []}
                    />
                )}
            </>
        </Modal>
    );
};

export default ClassInfoModal;
