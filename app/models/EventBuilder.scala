package models

import org.joda.time.DateTime

/**
 * Created with IntelliJ IDEA.
 * User: maciejprokopiuk
 * Date: 22/05/14
 * Time: 19:21
 * To change this template use File | Settings | File Templates.
 */
object EventBuilder {
  class EventBuilder(uid: Option[String],
                     startTime : Option[Long],
                     summary : Option[String],
                     location : Option[String],
                     endTime : Option[Long],
                     description : Option[String],
                     geo : Option[(Double,Double)])
  {
    def withUid(uid:String) = new EventBuilder(Some(uid), startTime, summary, location, endTime, description, geo)
    def withStartTime(startTime : Long) = new EventBuilder(uid, Some(startTime), summary, location, endTime, description, geo)
    def withSummary(summary : String) = new EventBuilder(uid, startTime, Some(summary), location, endTime, description, geo)
    def withLocation(location : String) = new EventBuilder(uid, startTime, summary, Some(location), endTime, description, geo)
    def withEndTime(endTime : Long) = new EventBuilder(uid, startTime, summary, location, Some(endTime), description, geo)
    def withDescription(description : String) = new EventBuilder(uid, startTime, summary, location, endTime, Some(description), geo)
    def withGeo(geo : (Double, Double)) = new EventBuilder(uid, startTime, summary, location, endTime, description, Some(geo))

    def build = new Event(uid.get, startTime.get, summary.get, location.get, endTime, description, geo)
  }

  def builder = new EventBuilder(None, None, None, None, None, None, None)
}

