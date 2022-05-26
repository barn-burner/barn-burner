export interface LogoInterface {
  url: string
}

export interface TeamInterface {
  abbreviation: string,
  id: string,
  locationName: string,
  name: string,
  teamName: string,
  logoUrl: string
}

export interface TeamsInterface {
  [index: number]: TeamInterface
}

export interface SingleGameDataInterface {
  away: {
    id: number,
    score: number
  },
  gameDate: Date,
  gameId: number
  home: {
    id: number,
    score: number
  },
  winnerId: number
}
