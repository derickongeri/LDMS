

<script>
export default {
 mounted(){
     this.$Log("GoogleAnalytics ", this.currentTab)
     const currentTab = this.currentTab
     this.$gtag.event(`currentAnalysisTab`, {
      event_category: `currentTab`,
      event_label: `${currentTab}`,
      value: 1
    });
 }
}
</script>

