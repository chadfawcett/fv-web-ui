{% extends 'layouts/application.swig' %}

{% block content %}
  <div id="app-wrapper" class="app-wrapper">
  	<div id="app-loader" class="app-loader">

	<div style="width: 50%; margin: 0 auto; border: 1px #ccc solid; padding: 15px;font-size: 16pt;">
		<p><strong>FirstVoices</strong></p>
		<p>FirstVoices is a suite of web-based tools and services designed to support Indigenous people engaged in language archiving, language teaching and culture revitalization.</p>
	</div>

	<p>Loading / Chargement / Cargando...</p>

	</div>
  </div>

{% endblock %}

{% block head %}

	<style type='text/css'>

	    /** App Loader **/
        .app-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgb(170, 18, 37);
            color: #FFFFFF;
            text-align: center;
            padding-top: 50vh;
            font-size: 4rem;
        }

	</style>

{% endblock %}

{% block javascript %}

	{% if buildENV == "production" %}

		<script type="text/javascript">
		Raven.config('https://9f99c993909b4dda85e7178a0eadc7fa@sentry.io/1212465').install();
		</script>

		<!-- Matomo -->
		<script type="text/javascript">
		var _paq = _paq || [];
		/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
		_paq.push(['trackPageView']);
		_paq.push(['enableLinkTracking']);
		(function() {
			var u="//analytics.firstvoices.com/";
			_paq.push(['setTrackerUrl', u+'piwik.php']);
			_paq.push(['setSiteId', '1']);
			var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
			g.type='text/javascript'; g.async=true; g.defer=true; g.src=u + 'piwik.js'; s.parentNode.insertBefore(g,s);
		})();
		</script>
		<!-- End Matomo Code -->

	{% endif %}

{% endblock %}
