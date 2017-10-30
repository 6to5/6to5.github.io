---
layout: page
title: Meet the Team
# description:
permalink: /team/
---

<div class="container team">
  {% include member.html members=site.data.team.core title="Core Team" %}
  {% include member.html members=site.data.team.members title="Members" %}
  {% include member.html members=site.data.team.tc39 title="Friends on TC39" %}
  {% include member.html members=site.data.team.v8 title="V8" %}
  {% include member.html members=site.data.team.eslint title="ESLint" %}
  {% include member.html members=site.data.team.website title="Website" %}
  {% include member.html members=site.data.team.summer-of-code title="Summer of Code" %}
  {% include member.html members=site.data.team.non-human-member title="Non-Human Members" %}
  {% include member.html members=site.data.team.alumnus title="Inactive members" %}
</div>
