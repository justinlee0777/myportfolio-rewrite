<style>
    .page {
        font-family: Bookerly;
        font-size: 14px;
        line-height: 2;
        height: 8in;
        padding: .25in .25in .5in;
        white-space: normal;
        width: 5in;

        p {
            margin: 1em;
        }

        p:not(.prospero--fragment) {
            text-indent: 1em;
        }

        ul {
            margin: 0;
            padding-left: 2em;

            p:not(.prospero--fragment) {
                text-indent: 0;
            }
        }

        li.prospero--fragment {
            list-style: none;
        }
    }
</style>

It's interesting how much effort I put into separating my programming life and my "real" life (which can be observed by the very construction of this sentence already). Mentally speaking I put things in little boxes: there is a process for coding, there is a process for writing, there is a process for reading, there is a process for grocery shopping, for doing the laundry, etc. Every programmer I have met is in some way interested in technology, but in my own life I'm quite closed off to that. I am very primitive in my tastes and pretty much do what everyone else does.

The closest these two things have brushed together is when I was going through the process of self-publishing some books. My attitude has always been, Writing is about words. When it comes to publishing, the writing is but an asset. I quickly found that you can pretty much put anything into a book, everything inside the book boils down to an asset that the reader consumes, whether it's text, an image, etc. In self-publication, you are dealing with assets.

Microsoft Word, for whatever reason, is a terrible asset manager. When it came to the book covers, I furthermore didn't want to shell money out for Photoshop or other PDF software, as they can be quite expensive. I remember being befuddled by the experience: assets are just data. Why is this so hard?

That's when I realized that, as a frontend enginner, I was equipped with every skill to handle assets, easily and for free. I had the cheapest renderer possible, which also handled PDFs out-of-the-box: the web browser.

Since then, I have fostered other contentions with word processing programs. Their startup time is slow, the underlying data structures are confusing, and they actually don't facilitate writing time / drafting. For example, to italicize something in Word or Google Docs, you have to stop and click on an italics button, type, then click on the button again to reset the text styles. I have used Markdown for my blog since 2021, and italics is _this easy_, it's learning the Markdown specification and knowing ahead-of-time when you want to transform your text, which is almost certainly all of the time. It takes me two characters to italicize a word without removing my hands from the keyboard, thereby facilitating thinking speed.

So, yeah, this idea.

I was thinking on [Dijkstra's "On The Cruelty Of Really Teaching Computing Science"](/prospero/on-the-cruelty-of-really-teaching-computing-science) while wondering why these processing programs were popular. I don't do consumer feedback surveys, so I can only speculate. My hunch is that the buttons and gizmos of these programs are explicit. It's easier to teach someone how to use buttons than teach them another language, even though I have struggled with Word's settings for line height and indentation since the beginning of time.

Rather than have users edit the exact experience they want, which forces the program to be simultaneously in a read-write mode, by having the users write out Markdown which then gets translated into the final experience, the user can focus on the most important act of creating their document / book: the writing part. For the creation of the ultimate PDF, you're in luck: Markdown allows other HTML tags, which means you can define your own tags and set your own policies.

The other reason for processing programs I thought of is that users want different policies for different paragraphs, even different sentences. I think this is a fair thing to want even though I have never understood it. When formatting a book or a blog post, the spacing and font for every paragraph should be the same; only one policy is needed. Nevertheless, this lack of per-sentence policy is a glaring weakness in this type of program.

Some notes on the program:

- The "Rendered Document" tab uses Prospero, which is [a thing I wrote](https://github.com/justinlee0777/prospero-library). This is why, unfortunately, you see a lot of prospero-specific CSS at the top.

- You see "Bookerly" used above, a font used for Kindle. I had to download it before it could be used, which process is somewhat complex for people who only know HTML as a language. However, I will add a note on this later.

- You can see some CSS rules use pretty complex selectors, which **really** limits the promises of this exercise.

And to return to the above note on fonts:

- The grandiose plan for this program would be to include an interface to adjust the policy on the "Rendered Document" itself. For example, there would be a text-indent option controlling indentation, and you can see the specific stylings for header tags, p tags, etc. This is for people who like user interfaces and don't want to have to go to MDN for everything.

- Fonts would, therefore, be easy to map. Just drag-and-drop your font files or provide URLs and the font faces will be added up (pending proper security checks, of course).

- The user interface would also ideally have a print function that automates the pipeline from HTML to PDF. (In fact, this would save me so much time in the future I should build it some time soon...)

Tne big feature would be to make this a standalone program and not embedded on my site. Then one could control the window views and actually show both the editor and the rendered document simultaneously for live-editing (which prospero _should_ support, but it's one thing to say it works in theory and another to see it work in practice). Viewport sizes would have to be considered, unless the JS API allows splitting the program into separate windows which would be radical (and a quick Google search says, Yes, this is possible; neato!).

But all of that is work that isn't particularly useful to me (except the print function, as mentioned before) and I'm also too lazy. Really I thought it was just fun doing something new with Prospero and I wanted to think about the implications of such a program briefly. I'm too old to be delusional to think my half-baked idea actually has legs, although I do think it's true most word processing programs are way overtuned, and it's not hard to imagine we can expect more tech literacy from subsequent generations of computer users.

And, honestly, I would probably use this for any upcoming books I want to write. In fact, I think I will write up the next one in Markdown; the only thing is that I use VS Code as my editor and it's too "dark" and "brooding" for what I think is an inherently creative exercise. But programming is sometimes hacking your brain, so I can just pick up a different editor or configure a different theme or whatever.
