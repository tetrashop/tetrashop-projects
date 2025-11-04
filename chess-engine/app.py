
@app.route('/metrics')
def writer_metrics():
    return jsonify({
        "content_generated": writer.get_generation_stats(),
        "quality_scores": writer.get_quality_metrics(), 
        "seo_optimization": writer.get_seo_performance()
    })

@app.route('/metrics')
def writer_metrics():
    return jsonify({
        "content_generated": writer.get_generation_stats(),
        "quality_scores": writer.get_quality_metrics(), 
        "seo_optimization": writer.get_seo_performance()
    })
