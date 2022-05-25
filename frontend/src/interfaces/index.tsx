export interface LogoInterface {
  url: string
}

export interface TeamInterface {
  abbreviation: string,
  id: string,
  locationName: string,
  name: string,
  teamName: string,
  url: string
}

export interface TeamsInterface {
  [index: number]: TeamInterface
}