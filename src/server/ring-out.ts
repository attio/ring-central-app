import {complete, isErrored} from "@attio/fetchable"
import {sendToRingCentral} from "./send-to-ring-central"

export async function ringOut(fromPhoneNumber: string, toPhoneNumber: string) {
    const ringOutResult = await sendToRingCentral("/account/~/extension/~/ring-out", {
        method: "POST",
        body: {
            from: {
                phoneNumber: fromPhoneNumber,
            },
            to: {
                phoneNumber: toPhoneNumber,
            },
            playPrompt: true,
        },
    })

    if (isErrored(ringOutResult)) {
        return ringOutResult
    }

    return complete(null)
}
