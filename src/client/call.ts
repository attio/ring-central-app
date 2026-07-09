import {isComplete} from "@attio/fetchable"
import {showToast} from "attio/client"
import dial from "../server/dial.server"
import {assertNever} from "../utils/assert-never"

export async function call({
    name,
    phoneNumber,
}: {
    name: string | null | undefined
    phoneNumber: string
}) {
    const {hideToast} = await showToast({
        variant: "neutral",
        title: name ? `Dialing ${name}...` : "Dialing...",
        dismissable: false,
        durationMs: Number.POSITIVE_INFINITY,
    })

    try {
        const result = await dial(phoneNumber)

        if (isComplete(result)) {
            return
        }

        switch (result.error.code) {
            case "UNAUTHORIZED": {
                alert({
                    title: "Invalid user connection",
                    text: "Please reconnect from the app's settings.",
                })
                return
            }

            case "COMPANY_PHONE_NUMBER_NOT_FOUND":
                alert({
                    title: "Company number not found",
                    text: "We could not find the main company phone number. Check your RingCentral admin settings.",
                })
                return

            case "FAILED_TO_FETCH":
            case "FAILED_TO_PARSE_RESPONSE": {
                alert({
                    title: "Something went wrong",
                    text: "Try reloading the page or contacting support.",
                })
                return
            }

            default:
                assertNever(result.error)
        }
    } finally {
        await hideToast()
    }
}
