import type {App} from "attio"
import {runQuery, showDialog, showToast} from "attio/client"
import query from "../queries/getCallablePeopleInCompany.graphql"
import {call} from "./call"
import {CallDialog, type Person} from "./call-dialog.component"

export const callCompanyAction: App.Record.Action = {
    id: "call-company-action",
    onTrigger: async ({recordId}) => {
        const {company} = await runQuery(query, {recordId})

        // Filter down to people with a phone number
        const people: Person[] =
            company?.team
                .map((person) => ({
                    id: person.id,
                    name: person.name?.full_name,
                    email: person.email_addresses[0],
                    phoneNumber: person.phone_numbers?.[0],
                }))
                .filter((person) => person.phoneNumber) ?? []

        if (!people.length) {
            showToast({
                title: "No phone numbers for anyone in this company.",
                variant: "error",
            })
            return
        }

        if (people.length === 1) {
            await call({
                name: people[0].name,
                phoneNumber: people[0].phoneNumber,
            })
            return
        }

        await showDialog({
            title: "Call now",
            Dialog: ({hideDialog}) => (
                <CallDialog
                    people={people}
                    onChoose={async (person) => {
                        hideDialog()
                        await call({
                            name: person.name,
                            phoneNumber: person.phoneNumber,
                        })
                    }}
                />
            ),
        })
    },
    label: "Call",
    objects: "companies",
}
