import React, { memo } from 'react'
import styled from 'styled-components'
import { breakpoints, px } from 'src/utils'

const SkeletonContainer = styled.div`
  @media only screen and (min-width: ${px(
      breakpoints.mobile.min
    )}) and (max-width: ${px(breakpoints.mobile.max)}) {
    min-height: 105px;
    margin-bottom: 1em;
    display: grid;
    grid-template-columns: 7em auto;
  }

  @media only screen and (min-width: ${px(breakpoints.tablet.min)}) {
    width: 19em;
    margin: 0em 1.5em 3em;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`

const SkeletonImage = styled.div`
  background: #e0e0e0;

  @media only screen and (min-width: ${px(
      breakpoints.mobile.min
    )}) and (max-width: ${px(breakpoints.mobile.max)}) {
    width: 100px;
    height: 100px;
  }

  @media only screen and (min-width: ${px(breakpoints.tablet.min)}) {
    width: 200px;
    height: 200px;
    margin-bottom: 0.5em;
  }
`

const SkeletonText = styled.div`
  background: #e0e0e0;
  height: 1em;

  @media only screen and (max-width: ${px(breakpoints.mobile.max)}) {
    margin-left: 1em;
    width: 80%;
  }

  @media only screen and (min-width: ${px(breakpoints.tablet.min)}) {
    width: 16em;
    margin-bottom: 0.5em;
  }
`

const SkeletonButtons = styled.div`
  display: flex;
  margin-top: 0.5em;

  @media only screen and (max-width: ${px(breakpoints.mobile.max)}) {
    margin-left: 1em;
  }

  @media only screen and (min-width: ${px(breakpoints.tablet.min)}) {
    justify-content: center;
    width: 100%;
  }
`

const SkeletonButton = styled.div`
  background: #e0e0e0;
  width: 3em;
  height: 2em;

  &:first-child {
    border-radius: 5px 0 0 5px;
  }

  &:last-child {
    border-radius: 0 5px 5px 0;
  }
`

const SkeletonCard = memo(() => {
  return (
    <SkeletonContainer>
      <SkeletonImage />
      <div>
        <SkeletonText />
        <SkeletonButtons>
          <SkeletonButton />
          <SkeletonButton />
        </SkeletonButtons>
      </div>
    </SkeletonContainer>
  )
})

export default SkeletonCard
