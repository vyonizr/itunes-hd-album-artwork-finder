import React, { useState, useEffect } from 'react'
import { withTheme } from 'styled-components'
import InputText from 'src/components/atoms/Input/InputText'
import ButtonSubmit from 'src/components/atoms/Button/ButtonSubmit'
import { Form } from './style'

type Props = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>, query: string) => void
}

type Query = {
  value: string
  error: null | string
}

const SearchForm: any = ({ onSubmit }: Props) => {
  const [query, setQuery] = useState<Query>({
    value: '',
    error: null
  })

  const [placeholders] = useState<string[]>([
    'taylor swift folklore',
    'arctic monkeys am',
    'pink floyd wish you were here',
    'tame impala',
    'linkin park',
    'vyonizr',
    'mylo xyloto',
    'death of a bachelor',
    'blurryface'
  ])

  const [shownPlaceholder, setShownPlaceholder] = useState<string>('')

  useEffect(() => {
    setShownPlaceholder(pickRandomElement(placeholders))
  }, [])

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
        <InputText
          value={query.value}
          id="query"
          onChange={handleChangeQuery}
          placeholder={shownPlaceholder}
        />
        <input
          type="submit"
          style={{
            position: 'absolute',
            left: '-9999px',
            width: '1px',
            height: '1px'
          }}
          tabIndex={-1} />
        <ButtonSubmit />
      </div>
    </Form>
  )
}

export default withTheme(SearchForm)