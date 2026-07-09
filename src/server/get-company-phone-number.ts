import {complete, errored, isErrored} from "@attio/fetchable"
import {z} from "zod"
import {sendToRingCentral} from "./send-to-ring-central"

const phoneNumbersSchema = z.object({
    records: z.array(
        z.object({
            phoneNumber: z.string(),
        })
    ),
})

export async function getCompanyPhoneNumber() {
    const phoneNumbersResult = await sendToRingCentral(
        "/account/~/extension/~/phone-number?usageType=MainCompanyNumber",
        {
            method: "GET",
        }
    )

    if (isErrored(phoneNumbersResult)) {
        return phoneNumbersResult
    }

    try {
        const phoneNumbers = phoneNumbersSchema.parse(JSON.parse(phoneNumbersResult.value))

        if (phoneNumbers.records.length === 0) {
            return errored({
                code: "COMPANY_PHONE_NUMBER_NOT_FOUND" as const,
            })
        }

        return complete(phoneNumbers.records[0])
    } catch {
        return errored({
            code: "FAILED_TO_PARSE_RESPONSE",
        })
    }
}
