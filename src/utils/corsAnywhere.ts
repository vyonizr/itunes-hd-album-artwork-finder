const corsAnywhere = (targetURL: string): string => {
  const corsAnywhere:string = 'https://cors-anywhere.herokuapp.com/'
  return `${corsAnywhere}${targetURL}`
}

export default corsAnywhere