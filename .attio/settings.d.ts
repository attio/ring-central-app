import "attio"

import type appSettingsSchema from "../src/app.settings"

declare module "attio" {
    export interface AppSettingsSchema {
        workspace: (typeof appSettingsSchema)["workspace"]
    }
}
