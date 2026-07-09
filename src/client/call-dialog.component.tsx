import {type JSX} from "react"
import {Forms, useForm} from "attio/client"

export type Person = {
    id: string
    name?: string | null | undefined
    email: string
    phoneNumber: string
}

export function CallDialog({
    people,
    onChoose,
}: {
    people: Person[]
    onChoose: (person: Person) => Promise<void>
}): JSX.Element {
    const {Form, Combobox, SubmitButton} = useForm(
        {personId: Forms.string()},
        {personId: people[0].id}
    )

    return (
        <Form
            onSubmit={async ({personId}) =>
                await onChoose(people.find(({id}) => id === personId) as Person)
            }
        >
            <Combobox
                label="Who do you want to call?"
                name="personId"
                options={people.map((person) => ({
                    value: person.id,
                    label: person.name ?? person.email,
                }))}
                placeholder="Select a person"
            />
            <SubmitButton label="Call" />
        </Form>
    )
}
