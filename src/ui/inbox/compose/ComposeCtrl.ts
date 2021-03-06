import Stream from 'mithril/stream'
import throttle from 'lodash-es/throttle'
import { ErrorResponse } from '../../../http'
import redraw from '../../../utils/redraw'
import { handleXhrError } from '../../../utils'
import * as xhr from './../inboxXhr'
import { ComposeResponse } from '../interfaces'
import router from '../../../router'

interface SendError {
  username: Array<string>
  subject: Array<string>
  text: Array<string>
}

interface SendErrorResponse extends ErrorResponse {
  body: SendError
}

export interface IComposeCtrl {
  id: Stream<string>
  errors: Stream<SendError>
  send: (form: HTMLFormElement) => void
  onInput: (e: Event) => void
  autocompleteResults: Stream<Array<string>>
}

export default function ComposeCtrl(userId: string): IComposeCtrl {

  const id = Stream<string>(userId)
  const errors = Stream<SendError>()
  const autocompleteResults = Stream<string[]>([])

  function send(form: HTMLFormElement) {
    const recipient = (form[0] as HTMLInputElement).value
    const subject = (form[1] as HTMLInputElement).value
    const body = (form[2] as HTMLTextAreaElement).value
    xhr.newThread(recipient, subject, body)
    .then((data: ComposeResponse) => {
      if (data.ok) {
        router.set('/inbox/' + data.id)
      }
      else {
        redraw()
      }
    })
    .catch(handleSendError)
  }

  function handleSendError(error: SendErrorResponse) {
    if (error.body && (error.body.username || error.body.subject || error.body.text)) {
      errors(error.body)
      redraw()
    }
    else {
      handleXhrError(error)
    }
  }

  return {
    id,
    errors,
    send,
    onInput: throttle((e: Event) => {
      const term = (e.target as HTMLInputElement).value.trim()
      if (term.length >= 3) {
        xhr.autocomplete(term).then(data => {
          autocompleteResults(data)
          redraw()
        })
      }
      else {
        autocompleteResults([])
        redraw()
      }
    }, 250),
    autocompleteResults
  }
}
