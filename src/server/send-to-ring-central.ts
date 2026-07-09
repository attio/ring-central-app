import {complete, errored} from "@attio/fetchable"
import {getUserConnection} from "attio/server"

export async function sendToRingCentral(
    path: string,
    {method, body}: {method: "GET" | "POST"; body?: Record<string, unknown>}
) {
    const connection = getUserConnection()

    const response = await fetch(`https://platform.ringcentral.com/restapi/v1.0${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${connection.value}`,
        },
        ...(body && {body: JSON.stringify(body)}),
    })

    if (!response.ok) {
        if (response.status === 401) {
            return errored({
                code: "UNAUTHORIZED" as const,
            })
        }

        console.error(`Unexpected RingCentral API error: ${await response.text()}`)
        return errored({
            code: "FAILED_TO_FETCH" as const,
        })
    }

    return complete(await response.text())
}
