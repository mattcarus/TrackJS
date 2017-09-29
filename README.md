TrackJS
=======

A client-side javascript tracking library for Splunk

## Simple Usage

```
<script src="trackjs.min.js"></script>
<script>
	track.init("http://localhost:8000/pixel.php");
</script>
```

## With appUserID
If you app has its own user IDs, then these can be logged to facilitate better user tracking:

```
<script src="trackjs.min.js"></script>
<script>
	var userId = 123456;
	track.init("http://localhost:8000/pixel.php", userId);
</script>
```