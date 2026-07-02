import React, { useState, useEffect, useRef, useCallback } from 'react'

import IconCancel from 'src/assets/icons/IconCancel'
import InputText from 'src/components/atoms/Input/InputText'
import ButtonSubmit from 'src/components/atoms/Button/ButtonSubmit'
import { Form, ClearQueryButton } from './style'

type Props = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>, query: string) => void
}

type Query = {
  value: string
  error: null | string
}

type TrendingEntry = {
  artist: string
  album: string
}

const FALLBACK_PLACEHOLDERS: string[] = [
  'taylor swift folklore',
  'arctic monkeys am',
  'pink floyd wish you were here',
  'tame impala',
  'linkin park',
  'vyonizr',
  'mylo xyloto',
  'death of a bachelor',
  'blurryface',
]

const ROTATION_INTERVAL = 4000

const pickRandomElement = (array: string[]): string => {
  return array[Math.floor(Math.random() * array.length)]
}

const SearchForm: any = ({ onSubmit }: Props) => {
  const [query, setQuery] = useState<Query>({
    value: '',
    error: null,
  })

  const [shownPlaceholder, setShownPlaceholder] = useState<string>('')
  const [placeholders, setPlaceholders] = useState<string[]>(FALLBACK_PLACEHOLDERS)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const rotatePlaceholder = useCallback(() => {
    setShownPlaceholder((prev) => {
      const next = pickRandomElement(placeholders)
      return next !== prev ? next : pickRandomElement(placeholders)
    })
  }, [placeholders])

  useEffect(() => {
    fetch('/api/trending')
      .then((res) => res.json())
      .then((data: { entries: TrendingEntry[] }) => {
        if (data.entries?.length) {
          const entries = data.entries.map(
            (e) => `${e.artist} ${e.album}`
          )
          setPlaceholders(entries)
          setShownPlaceholder(pickRandomElement(entries))
        } else {
          setShownPlaceholder(pickRandomElement(FALLBACK_PLACEHOLDERS))
        }
      })
      .catch(() => {
        setShownPlaceholder(pickRandomElement(FALLBACK_PLACEHOLDERS))
      })
  }, [])

  useEffect(() => {
    intervalRef.current = setInterval(rotatePlaceholder, ROTATION_INTERVAL)
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [rotatePlaceholder])

  const handleChangeQuery = (event: { target: HTMLInputElement }): void => {
    setQuery({
      value: event.target.value,
      error: null,
    })
  }

  const clearQuery = (): void => {
    setQuery({
      value: '',
      error: null,
    })
  }

  return (
    <Form autoComplete='off' onSubmit={(event) => onSubmit(event, query.value)}>
      <div>
        <label htmlFor='query' className='query-label'>
          Artist name and/or album title
        </label>
      </div>
      <div>
        <div>
          <InputText
            value={query.value}
            id='query'
            onChange={handleChangeQuery}
            placeholder={shownPlaceholder}
          />
          {query.value.length > 0 && (
            <ClearQueryButton onClick={clearQuery}>
              <IconCancel />
            </ClearQueryButton>
          )}
        </div>
        <input
          type='submit'
          style={{
            position: 'absolute',
            left: '-9999px',
            width: '1px',
            height: '1px',
          }}
          tabIndex={-1}
        />
        <ButtonSubmit aria-label='submit button' />
      </div>
    </Form>
  )
}

export default SearchForm
