
export type CASOptionsType = {
    cas_url: String,
    service_url: String,
    cas_version: '1.0' | '2.0' | '3.0' | 'saml1.1',
    renew: Boolean,
    is_dev_mode: Boolean,
    dev_mode_user: String,
    dev_mode_info: Object,
    session_name: String,
    session_info: String,
    destroy_session: Boolean
}

// Development options
export const CASOptionsDev: CASOptionsType = {
    cas_url:"https://login.kth.se",
    service_url: "http://localhost:8080",
    cas_version: '3.0',
    renew: false,
    is_dev_mode: true,
    dev_mode_user: "fdev",
    dev_mode_info:{"kthid":"abc1234"},
    session_name: "cas_user",
    session_info: "cas_userinfo",
    destroy_session: false
}

// Production options
export const CASOptionsPro: CASOptionsType = {
    cas_url:"https://login.kth.se",
    service_url: "https://f.kth.se/fas",
    cas_version: '3.0',
    renew: false,
    is_dev_mode: false,
    dev_mode_user: "fdev",
    dev_mode_info:{"kthid":"abc1234"},
    session_name: "cas_user",
    session_info: "cas_userinfo",
    destroy_session: false
}