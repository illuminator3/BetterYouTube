/*
 * Copyright 2020 illuminator3
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

$({
    channel: {
        load: () => {
            $(() => {
                const loc = window.location.href

                if (loc.indexOf("view_as=subscriber") > -1)
                {
                    const newUrl = loc.replace("view_as=subscriber", "")

                    window.location.replace(newUrl)
                }
            })
        }
    },
    main: {
        enable: () => {
            $(remove("footer"))
            $(elementClass("style-scope ytd-guide-collapsible-section-entry-renderer")[7].remove())

            $(() => {
                const e = elementClass("style-scope ytd-guide-renderer")
                const b = e[3]
                const c = e[7]

                b.remove()
                c.remove()
            })
        }
    },
    video: {
        enable: () => {
            $(remove("ab4yt-brand"), 20)
            $(remove("clarify-box"))

            $(() => {
                elementTag("ytd-expander")[0].removeAttribute("collapsed")

                const c = elementClass("less-button style-scope ytd-video-secondary-info-renderer")

                if (c.length === 1)
                    c[0].remove()
            })

            $(() => {
                const c = elementClass("super-title style-scope ytd-video-primary-info-renderer")
                const e = c[0]
                const h = e.children

                for (let i = 0; i < h.length; i++)
                {
                    const d = h[i]

                    if (d.classList.contains("yt-simple-endpoint"))
                    {
                        d.classList.add("byt-tag")
                        d.textContent = d.textContent.substring(1)
                    }
                }
            })

            $(() => {
                const e = elementId("owner-sub-count")

                if (e == null) return

                const t = e.textContent

                e.remove()

                const c = elementClass("style-scope ytd-subscribe-button-renderer")
                const r = c[0]

                if (r != null && t != null)
                    r.textContent = t
            })

            $(() => {
                const e = elementClass("yt-simple-endpoint style-scope yt-formatted-string")

                for (let i = 0; i < e.length; i++)
                {
                    const d = e[i]

                    if (d.getAttribute("href").startsWith("/channel/"))
                    {
                        d.classList.add("byt-channel")

                        break
                    }
                }
            })

            $(() => {
                const e = elementClass("title style-scope ytd-video-primary-info-renderer")
                const c = e[0].children[0]

                c.classList.add("byt-title")
            })
        }
    },
    enable: () => {
        $(remove("country-code"))

        $(() => {
            const e = elementClass("style-scope ytd-notification-topbar-button-renderer notification-button-style-type-default")

            if (e.length <= 0) return

            const u = e[0]
            const c = u.children
            const f = c[0]

            f.click()
            f.click()
        })
    }
})