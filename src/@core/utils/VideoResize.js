// VideoResize.js
import Quill from 'quill'
import ImageResize from 'quill-image-resize-module-react'

export default class VideoResize extends ImageResize {
  static checkNode(node) {
    // Enable both <img> and <iframe> resizing
    return node && (node.tagName === 'IMG' || node.tagName === 'IFRAME')
  }
}

// Register it as part of Quill modules
Quill.register('modules/videoResize', VideoResize)
