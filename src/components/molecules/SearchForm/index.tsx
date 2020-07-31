import React, { useState } from 'react'
import TextInput from 'src/components/atoms/Input/InputText'
import { Form } from './style'
import IconSearch from 'src/assets/icons/IconSearch'

type Props = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>, query: string) => void
}

type Query = {
  value: string
  error: null | string
}


const SearchForm = ({ onSubmit }: Props) => {
  const [query, setQuery] = useState<Query>({
    value: '',
    error: null
  })

  const [examples] = useState<string[]>([
    'taylor swift folklore',
    'arctic monkeys am',
    'pink floyd wish you were here',
    'tame impala',
    'linkin park',
    'twenty one pilots',
    'mylo xyloto',
    'death of a bachelor',
    'blurryface'
  ])

  const handleChangeQuery = (event: { target: HTMLInputElement }) => {
    setQuery({
      value: event.target.value,
      error: null,
    })
  }

  const pickRandomElement = (array:any[]) => {
    const pickedIndex = Math.floor(Math.random() * (array.length))
    return array[pickedIndex]
  }

  return (
    <Form
      onSubmit={(event) => onSubmit(event, query.value)}
    >
      <div>
        <label htmlFor="query" className='query-label'>Artist name and/or album title</label>
      </div>
      <div>
        <TextInput
          value={query.value}
          id="query"
          onChange={handleChangeQuery}
          placeholder={pickRandomElement(examples)}
        />
        <button type="submit" className='search-button'><IconSearch /></button>
      </div>
    </Form>
  )
}

export default SearchForm