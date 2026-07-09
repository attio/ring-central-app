import {isErrored} from "@attio/fetchable"
import {getCompanyPhoneNumber} from "./get-company-phone-number"
import {getUserExtension} from "./get-user-extension"
import {ringOut} from "./ring-out"

export default async function dial(phoneNumber: string) {
    const extensionResult = await getUserExtension()

    if (isErrored(extensionResult)) {
        return extensionResult
    }

    const fromPhoneNumberResult = await getCompanyPhoneNumber()

    if (isErrored(fromPhoneNumberResult)) {
        return fromPhoneNumberResult
    }

    return ringOut(
        `${fromPhoneNumberResult.value.phoneNumber}*${extensionResult.value.extensionNumber}`,
        phoneNumber
    )
}
