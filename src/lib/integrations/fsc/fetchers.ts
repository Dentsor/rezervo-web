import { DateTime } from "luxon";

import { calculateMondayOffset, LocalizedDateTime } from "@/lib/helpers/date";
import {
    DetailedFscClass,
    DetailedFscWeekSchedule,
    FscActivityDetail,
    FscClass,
    FscWeekSchedule,
} from "@/lib/integrations/fsc/types";

function fscWeekScheduleUrl(fromDate: DateTime) {
    return `https://fsc.brpsystems.com/brponline/api/ver3/businessunits/8/groupactivities?period.start=${fromDate.toUTC()}&period.end=${fromDate
        .plus({ week: 1 })
        .toUTC()}`;
}

function fscActivityDetailUrl(activityId: number) {
    return `https://fsc.brpsystems.com/brponline/api/ver3/products/groupactivities/${activityId}`;
}

async function fetchActivityDetail(activityId: number) {
    return fetch(fscActivityDetailUrl(activityId)).then(async (response: Response) => {
        if (!response.ok) {
            throw new Error(
                `Failed to fetch class detail for fsc class with id ${activityId}, received status ${response.status}`,
            );
        }

        const groupActivityDetail: FscActivityDetail = await response.json();

        return groupActivityDetail;
    });
}

function toDetailedFscClass(fscClass: FscClass, fscActivityDetail: FscActivityDetail): DetailedFscClass {
    return {
        ...fscClass,
        description: fscActivityDetail.description,
        // The images have lower resolution further back in the assets list.
        // Index 2 seems like a good balance between resolution and load time
        image: fscActivityDetail.assets?.at(2)?.contentUrl ?? "",
    };
}

async function fetchDetailedFscWeekSchedule(fscWeekSchedule: FscWeekSchedule): Promise<DetailedFscWeekSchedule> {
    const fetchPromises: Map<number, Promise<FscActivityDetail>> = new Map();

    return Promise.all(
        fscWeekSchedule.map(async (fscClass) => {
            const activityId = fscClass.groupActivityProduct.id;
            if (!fetchPromises.has(activityId)) {
                fetchPromises.set(activityId, fetchActivityDetail(activityId));
            }

            const fscActivityDetail = await fetchPromises.get(activityId);

            if (fscActivityDetail === undefined) {
                throw new Error(`Failed to fetch activity detail for activity with id ${activityId}`);
            }

            return toDetailedFscClass(fscClass, fscActivityDetail);
        }),
    );
}

export async function fetchFscWeekSchedule(weekOffset: number): Promise<DetailedFscWeekSchedule> {
    const startDate = LocalizedDateTime.now()
        .startOf("day")
        .plus({ day: weekOffset * 7 - calculateMondayOffset() });
    const response = await fetch(fscWeekScheduleUrl(startDate));
    if (!response.ok) {
        throw new Error(`Failed to fetch schedule with startDate ${startDate}, received status ${response.status}`);
    }
    const fscWeekSchedule: FscWeekSchedule = await response.json();
    return fetchDetailedFscWeekSchedule(fscWeekSchedule);
}
