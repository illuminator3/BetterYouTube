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

let yt_timeout = 0;

function click(id)
{
    safeAction(id, e => e.click())
}

function remove(id)
{
    safeAction(id, e => e.remove())
}

function safeAction(id, action)
{
    const e = elementId(id)

    if (e == null) console.error("Unknown element: " + id)
    else
        action(e)
}

function elementTag(tag)
{
    return document.getElementsByTagName(tag)
}

function elementClass(cls)
{
    return document.getElementsByClassName(cls)
}

function elementId(id)
{
    return document.getElementById(id)
}

function elementIdExists(id)
{
    return elementId(id) != null
}

function elementTagExists(tag)
{
    return elementTag(tag) != null
}

//=================================================================

function ytaction(handler)
{
    try
    {
        setTimeout(handler, yt_timeout)
    } catch (e)
    {
        yt_timeout += 100

        setTimeout(handler, yt_timeout)
    }
}

//=================================================================

let yt = {
    channel: {
        load: () => {},
        enable: () => {}
    },
    main: {
        load: () => {},
        enable: () => {}
    },
    video: {
        load: () => {},
        enable: () => {}
    },
    initialized: false,
    load: () => {},
    enable: () => {}
}

//=================================================================

const URL_TYPE = {
    NONE: (s1, s2) => false,
    CONTAINS: (s1, s2) => s1.indexOf(s2) > -1,
    EQUALS: (s1, s2) => s1 === s2,
    STARTS_WITH: (s1, s2) => s1.startsWith(s2),
    ENDS_WITH: (s1, s2) => s1.endsWith(s2)
}

const PAGE_TYPE = {
    CHANNEL: {
        url: "/channel/",
        type: URL_TYPE.CONTAINS,
        master: yt.channel
    },
    MAIN: {
        url: "youtube.com",
        type: URL_TYPE.NONE,
        master: yt.main
    },
    VIDEO: {
        url: "watch?v=",
        type: URL_TYPE.CONTAINS,
        master: yt.video
    }
}

const PAGE_TYPES = [PAGE_TYPE.CHANNEL, PAGE_TYPE.MAIN, PAGE_TYPE.VIDEO]

//=================================================================

function checkPage()
{
    const loc = window.location.href

    /*const types = PAGE_TYPES

    for (let i = 0; i < types.length; i++)
    {
        const y = types[i]

        console.log("y.type: " + y.type)
        console.log("y.url: " + y.url)
        console.log("loc: " + loc)
        console.log("r: " + y.type(y.url, loc))
        console.log("y: " + y)

        if (y.type(y.url, loc))
        {
            console.log("found")

            return y
        }
    }

    return PAGE_TYPE.MAIN*/

    if (loc.indexOf("/channel/") > -1)
        return PAGE_TYPE.CHANNEL
    else if (loc.indexOf("watch?v=") > -1)
        return PAGE_TYPE.VIDEO
    return PAGE_TYPE.MAIN
}

let page = checkPage()

//=================================================================

function $(handler, timeout = 0)
{
    setTimeout(() => {
        if (!yt.initialized)
        {
            console.log("Initializing $yt")

            if (handler instanceof Function)
            {
                yt.initialized = true
                yt.enable = handler
            }
            else
            {
                try
                {
                    yt.initialized = true

                    function c(func)
                    {
                        return func != null ? func : () => {}
                    }

                    yt.load = c(handler.load)
                    yt.enable = c(handler.enable)

                    yt.channel.load = c(handler.channel.load)
                    yt.channel.enable = c(handler.channel.enable)

                    yt.main.load = c(handler.main.load)
                    yt.main.enable = c(handler.main.enable)

                    yt.video.load = c(handler.video.load)
                    yt.video.enable = c(handler.video.enable)
                } catch (e)
                {
                    console.error("Unknown handler type: " + typeof handler)
                }
            }

            yt.load()
            page.master.load()
        }
        else
        {
            console.log("Injecting action")

            try
            {
                ytaction(handler)
            } catch (e)
            {
                console.error(e)
            }
        }
    }, timeout)
}

//=================================================================

let ythandlertimeout = 125

const ythandler = () => {
    console.log("Checking for ytd-app")

    if (elementTagExists("ytd-app"))
    {
        console.log("Running injection")

        yt.loaded = true
        yt.enable()
        page.master.enable()
    }
    else
    {
        console.error("Couldn't find yt app. Retrying in +=10ms")

        ythandlertimeout += 10

        setTimeout(ythandler, ythandlertimeout)
    }
}

setTimeout(ythandler, ythandlertimeout)

//=================================================================

function onPageChange()
{
    console.log("Detected page change")

    page = checkPage()

    console.log("Reinjecting $yt")

    yt.initialized = false

    $(yt)

    console.log("Restarting ythandler")

    ythandlertimeout = 7000

    setTimeout(ythandler, ythandlertimeout)
}

let lastLocation = window.location.href

const pageObserver = () => {
    const loc = window.location.href

    if (lastLocation !== loc)
        onPageChange()

    lastLocation = loc
}

setInterval(pageObserver, 100)