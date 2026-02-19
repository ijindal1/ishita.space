import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt();

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  return rss({
    title: 'Ishita Jindal',
    description: 'Writing about AI and memory.',
    site: context.site,
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/blog/${post.id}/`,
        content: sanitizeHtml(parser.render(post.body || ''), {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        }),
      })),
    customData: '<language>en-us</language>',
  });
}
