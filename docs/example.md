---
layout: default
title: Basic demo
nav_order: 5
description: "basic demo"
permalink: /demo
---

## Demo

This page hosts a basic demo that DOES NOT integrate with 
external services, but does demonstrate the screen shot annotation feature and 
the type of data that it's possible to pass on to developers.

```
<script src="https://unpkg.com/@shotputter/browser"></script>
<script>
const instance = window.Shotput({
      service: false,
      captureLogs: true,
      metadata: {
          "userName": "Demo user"
      }
});
</script>
```

<script src="https://unpkg.com/@shotputter/browser"></script>
<script>
const instance = window.Shotput({
      service: false,
      captureLogs: true,
      metadata: {
          "userName": "Demo user"
      }
});
</script>
