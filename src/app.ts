import type {App} from "attio"

import {callCompanyAction} from "./client/call-company.action"
import {callPersonAction} from "./client/call-person.action"

export const app: App = {
    record: {
        actions: [callCompanyAction, callPersonAction],
        bulkActions: [],
        widgets: [],
    },
    callRecording: {
        insight: {
            textActions: [],
        },
        summary: {
            textActions: [],
        },
        transcript: {
            textActions: [],
        },
    },
}
