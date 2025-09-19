import * as React from 'react'
import { useParams } from 'react-router'


export const ChallengePage: React.FC = () => {
  let { challengeType } = useParams()


  return <>[challenge screen {challengeType}]</>
}
