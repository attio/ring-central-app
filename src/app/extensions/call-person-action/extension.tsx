import {alert, runQuery, Extensions} from "attio/client"
import getPersonPhoneNumbersQuery from "../../../queries/getPersonPhoneNumbers.graphql"
import {call} from "../../../client/call"

export default Extensions.defineExtension({
    type: "record-action",
    id: "call-person-action",
    onTrigger: async ({recordId}) => {
        const {person} = await runQuery(getPersonPhoneNumbersQuery, {recordId})

        const name = person?.name?.full_name
        const phoneNumber = person?.phone_numbers?.[0]

        if (!phoneNumber) {
            alert({
                title: "No phone number",
                text: "No phone number found for this person.",
            })
            return
        }

        await call({
            name,
            phoneNumber,
        })
    },
    label: "Call",
    objects: "people",
})
