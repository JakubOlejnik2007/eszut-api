export type TProblemToSendEmail = {
    _id: string,
    priority: number,
    what: string,
    who: string,
    where: string,
    when: number,
    categoryName: string,
}

export type TAdministratorToSendEmail = {
    id: string,
    name: string,
    email: string
}