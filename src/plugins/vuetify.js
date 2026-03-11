import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, md } from 'vuetify/iconsets/md'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

export default createVuetify({
    theme: {
        defaultTheme: 'dark',
    },
    icons: {
        defaultSet: 'md',
        aliases,
        sets: {
            md,
        },
    },
})
