import {complete, errored, isErrored} from "@attio/fetchable"
import {z} from "zod"
import {sendToRingCentral} from "./send-to-ring-central"

const extensionResponseSchema = z.object({
    id: z.number(),
    extensionNumber: z.string(),
})

export async function getUserExtension() {
    const extensionResult = await sendToRingCentral("/account/~/extension/~", {method: "GET"})

    if (isErrored(extensionResult)) {
        return extensionResult
    }

    try {
        const extension = extensionResponseSchema.parse(JSON.parse(extensionResult.value))

        return complete(extension)
    } catch {
        return errored({code: "FAILED_TO_PARSE_RESPONSE" as const})
    }
}
